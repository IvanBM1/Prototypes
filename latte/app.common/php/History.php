<?php

/**
 * Stub generated by xlatte
 */
class History extends historyBase
{

    /**
     * @remote
     * @param object $options
     * @param string $orderBy
     * @return History
     */
    public static function searchOne($options, $orderBy = ""){

        $query = "SELECT #COLUMNS FROM history";
        $query = self::addOptions($query, $options);
        $query = self::addOrderBy($query, $orderBy);

        return DL::oneOf('History', $query);
    }

    /**
     * @remote
     * @param object $options
     * @param string $orderBy
     * @return History[]
     */
    public static function search($options, $orderBy = ""){

        $query = "SELECT #COLUMNS FROM history";

        $query = self::addOptions($query, $options);
        $query = self::addOrderBy($query, $orderBy);

        return DL::arrayOf('History', $query);
    }

	/**
	 * create GUID
	 * @return string
	 */
	function getGUID()
	{
		mt_srand((double)microtime() * 10000);
		$charid = strtoupper(md5(uniqid(rand(), true)));
		return $charid;
	}

	/**
	 * @override
	 * @return boolean
	 */
	public function onInserting()
	{
		$this->created = DL::dateTime();
		$this->guid = $this->getGUID();
		return true;
	}

    static function addOptions($query, $options){
        $size = 0;
        if($options != null) $size = count($options);
        if($size > 0) {
            $query .= " WHERE "; $i = 0;
            foreach ($options as $key => $value) {
                $query .= "$key = '$value'";$i++;
                if ($i < $size) $query .= " AND ";
            }
        }
        return $query;
    }

    static function addOrderBy($query, $orderBy){
        if($orderBy != "")
            $query .= " ORDER BY ". $orderBy;
        return $query;
    }


}